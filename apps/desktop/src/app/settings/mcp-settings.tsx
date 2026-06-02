import { useStore } from '@nanostores/react'
import { useEffect, useMemo, useState } from 'react'

import { OverlayActionButton, OverlayCard } from '@/app/overlays/overlay-chrome'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getHermesConfigRecord, type HermesGateway, saveHermesConfig } from '@/hermes'
import { Package, Wrench } from '@/lib/icons'
import { notify, notifyError } from '@/store/notifications'
import { $activeSessionId } from '@/store/session'
import type { HermesConfigRecord } from '@/types/hermes'

import { includesQuery } from './helpers'
import { EmptyState, LoadingState, Pill, SectionHeading, SettingsContent } from './primitives'
import type { SearchProps } from './types'

interface McpSettingsProps extends SearchProps {
  gateway?: HermesGateway | null
  onConfigSaved?: () => void
}

type McpServers = Record<string, Record<string, unknown>>

const EMPTY_SERVER = {
  command: '',
  args: [],
  env: {}
}

function getServers(config: HermesConfigRecord | null): McpServers {
  const raw = config?.mcp_servers

  return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as McpServers) : {}
}

const transportLabel = (server: Record<string, unknown>) =>
  typeof server.transport === 'string'
    ? server.transport
    : typeof server.url === 'string'
      ? 'http'
      : typeof server.command === 'string'
        ? 'stdio'
        : 'custom'

function serverMatches(name: string, server: Record<string, unknown>, query: string) {
  if (!query) {
    return true
  }

  return includesQuery(name, query) || includesQuery(JSON.stringify(server), query)
}

export function McpSettings({ gateway, onConfigSaved, query }: McpSettingsProps) {
  const activeSessionId = useStore($activeSessionId)
  const [config, setConfig] = useState<HermesConfigRecord | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [reloading, setReloading] = useState(false)

  useEffect(() => {
    let cancelled = false

    getHermesConfigRecord()
      .then(next => {
        if (cancelled) {
          return
        }

        setConfig(next)
        const first = Object.keys(getServers(next)).sort()[0] ?? null
        setSelected(first)
      })
      .catch(err => notifyError(err, 'MCP 配置加载失败'))

    return () => void (cancelled = true)
  }, [])

  const servers = useMemo(() => getServers(config), [config])
  const names = useMemo(() => Object.keys(servers).sort(), [servers])

  const filtered = useMemo(
    () => names.filter(serverName => serverMatches(serverName, servers[serverName], query.trim().toLowerCase())),
    [names, query, servers]
  )

  useEffect(() => {
    const server = selected ? servers[selected] : null

    setName(selected ?? '')
    setBody(JSON.stringify(server ?? EMPTY_SERVER, null, 2))
  }, [selected, servers])

  if (!config) {
    return <LoadingState label="Loading MCP servers..." />
  }

  const saveServer = async () => {
    const nextName = name.trim()

    if (!nextName) {
      notify({ kind: '错误', title: '名称必填', message: '为此 MCP 服务器提供配置键。' })

      return
    }

    let parsed: Record<string, unknown>

    try {
      const raw = JSON.parse(body)

      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error('服务器配置必须是 JSON 对象')
      }

      parsed = raw as Record<string, unknown>
    } catch (err) {
      notifyError(err, '无效的 MCP JSON')

      return
    }

    setSaving(true)

    try {
      const nextServers = { ...servers }

      if (selected && selected !== nextName) {
        delete nextServers[selected]
      }

      nextServers[nextName] = parsed

      const nextConfig = { ...config, mcp_servers: nextServers }
      await saveHermesConfig(nextConfig)
      setConfig(nextConfig)
      setSelected(nextName)
      onConfigSaved?.()
      notify({ kind: 'success', title: 'MCP 服务器已保存', message: `${nextName} applies after MCP reload.` })
    } catch (err) {
      notifyError(err, '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const removeServer = async (serverName: string) => {
    setSaving(true)

    try {
      const nextServers = { ...servers }
      delete nextServers[serverName]

      const nextConfig = { ...config, mcp_servers: nextServers }
      await saveHermesConfig(nextConfig)
      setConfig(nextConfig)
      setSelected(Object.keys(nextServers).sort()[0] ?? null)
      onConfigSaved?.()
    } catch (err) {
      notifyError(err, '移除失败')
    } finally {
      setSaving(false)
    }
  }

  const reloadMcp = async () => {
    if (!gateway) {
      notify({ kind: 'warning', title: '网关不可用', message: '重新加载 MCP 前请先重新连接网关。' })

      return
    }

    setReloading(true)

    try {
      await gateway.request('reload.mcp', {
        confirm: true,
        session_id: activeSessionId ?? undefined
      })
      notify({ kind: 'success', title: 'MCP 工具已重新加载', message: '新工具架构将在新一轮对话中生效。' })
    } catch (err) {
      notifyError(err, 'MCP 重新加载失败')
    } finally {
      setReloading(false)
    }
  }

  return (
    <SettingsContent>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionHeading icon={Package} meta={`${names.length} configured`} title="MCP servers" />
        <div className="flex items-center gap-2">
          <OverlayActionButton onClick={() => setSelected(null)}>New server</OverlayActionButton>
          <OverlayActionButton disabled={reloading} onClick={() => void reloadMcp()}>
            {reloading ? '加载中…' : '重新加载 MCP'}
          </OverlayActionButton>
        </div>
      </div>

      <div className="grid min-h-0 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <OverlayCard className="min-h-64 overflow-hidden p-2">
          {filtered.length === 0 ? (
            <EmptyState description="Add a stdio or HTTP server to expose MCP tools." title="No MCP servers" />
          ) : (
            <div className="grid gap-1">
              {filtered.map(serverName => {
                const server = servers[serverName]
                const active = selected === serverName

                return (
                  <button
                    className={`rounded-md px-2 py-2 text-left transition-colors hover:bg-(--chrome-action-hover) ${
                      active ? 'bg-accent/45 text-foreground' : 'text-muted-foreground'
                    }`}
                    key={serverName}
                    onClick={() => setSelected(serverName)}
                    type="button"
                  >
                    <div className="truncate text-sm font-medium">{serverName}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Pill>{transportLabel(server)}</Pill>
                      {server.disabled === true && <Pill>disabled</Pill>}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </OverlayCard>

        <OverlayCard className="grid gap-3 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Wrench className="size-4 text-muted-foreground" />
            {selected ? '编辑服务器' : '新建服务器'}
          </div>
          <label className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">Name</span>
            <Input onChange={event => setName(event.currentTarget.value)} placeholder="filesystem" value={name} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">Server JSON</span>
            <Textarea
              className="min-h-80 font-mono text-xs"
              onChange={event => setBody(event.currentTarget.value)}
              spellCheck={false}
              value={body}
            />
          </label>
          <div className="flex items-center justify-between">
            {selected ? (
              <OverlayActionButton disabled={saving} onClick={() => void removeServer(selected)} tone="danger">
                Remove
              </OverlayActionButton>
            ) : (
              <span />
            )}
            <OverlayActionButton disabled={saving} onClick={() => void saveServer()}>
              {saving ? '保存中…' : '保存服务器'}
            </OverlayActionButton>
          </div>
        </OverlayCard>
      </div>
    </SettingsContent>
  )
}
