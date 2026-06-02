import {
  Brain,
  type IconComponent,
  Lock,
  MessageCircle,
  Mic,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Wrench
} from '@/lib/icons'
import type { ThemeMode } from '@/themes/context'

import type { DesktopConfigSection } from './types'

interface ProviderPrefix {
  prefix: string
  name: string
  priority: number
}

export const EMPTY_SELECT_VALUE = '__hermes_empty__'
export const CONTROL_TEXT = 'text-[0.8125rem]'

export const PROVIDER_GROUPS: ProviderPrefix[] = [
  { prefix: 'NOUS_', name: 'Nous Portal', priority: 0 },
  { prefix: 'ANTHROPIC_', name: 'Anthropic', priority: 1 },
  { prefix: 'DASHSCOPE_', name: 'DashScope（通义千问）', priority: 2 },
  { prefix: 'HERMES_QWEN_', name: 'DashScope（通义千问）', priority: 2 },
  { prefix: 'DEEPSEEK_', name: 'DeepSeek', priority: 3 },
  { prefix: 'GOOGLE_', name: 'Gemini', priority: 4 },
  { prefix: 'GEMINI_', name: 'Gemini', priority: 4 },
  { prefix: 'GLM_', name: 'GLM / Z.AI', priority: 5 },
  { prefix: 'ZAI_', name: 'GLM / Z.AI', priority: 5 },
  { prefix: 'Z_AI_', name: 'GLM / Z.AI', priority: 5 },
  { prefix: 'HF_', name: 'Hugging Face', priority: 6 },
  { prefix: 'KIMI_', name: 'Kimi / Moonshot', priority: 7 },
  { prefix: 'MINIMAX_', name: 'MiniMax', priority: 8 },
  { prefix: 'MINIMAX_CN_', name: 'MiniMax（中国）', priority: 9 },
  { prefix: 'OPENCODE_GO_', name: 'OpenCode Go', priority: 10 },
  { prefix: 'OPENCODE_ZEN_', name: 'OpenCode Zen', priority: 11 },
  { prefix: 'OPENROUTER_', name: 'OpenRouter', priority: 12 },
  { prefix: 'XIAOMI_', name: '小米 MiMo', priority: 13 }
]

export const BUILTIN_PERSONALITIES = [
  'helpful',
  'concise',
  'technical',
  'creative',
  'teacher',
  'kawaii',
  'catgirl',
  'pirate',
  'shakespeare',
  'surfer',
  'noir',
  'uwu',
  'philosopher',
  'hype'
]

// Schema-side select overrides for desktop-relevant enum fields whose
// backend schema only declares a string type.
export const ENUM_OPTIONS: Record<string, string[]> = {
  'agent.image_input_mode': ['auto', 'native', 'text'],
  'approvals.mode': ['manual', 'smart', 'off'],
  'code_execution.mode': ['project', 'strict'],
  'context.engine': ['compressor', 'default', 'custom'],
  'delegation.reasoning_effort': ['', 'minimal', 'low', 'medium', 'high', 'xhigh'],
  'memory.provider': ['', 'builtin', 'honcho'],
  'stt.elevenlabs.model_id': ['scribe_v2', 'scribe_v1'],
  'stt.local.model': ['tiny', 'base', 'small', 'medium', 'large-v3'],
  'tts.openai.voice': ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
}

export const FIELD_LABELS: Record<string, string> = {
  model: '默认模型',
  model_context_length: '上下文窗口',
  fallback_providers: '备用模型',
  toolsets: '已启用的工具集',
  timezone: '时区',
  'display.personality': '人格设定',
  'display.show_reasoning': '推理过程',
  'agent.max_turns': '最大代理步数',
  'agent.image_input_mode': '图片附件模式',
  'terminal.cwd': '工作目录',
  'terminal.backend': '执行后端',
  'terminal.timeout': '命令超时',
  'terminal.persistent_shell': '持久化 Shell',
  'terminal.env_passthrough': '环境变量透传',
  file_read_max_chars: '文件读取上限',
  'tool_output.max_bytes': '终端输出上限',
  'tool_output.max_lines': '文件分页上限',
  'tool_output.max_line_length': '行长度上限',
  'code_execution.mode': '代码执行模式',
  'approvals.mode': '审批模式',
  'approvals.timeout': '审批超时',
  'approvals.mcp_reload_confirm': '确认 MCP 重载',
  command_allowlist: '命令白名单',
  'security.redact_secrets': '脱敏密钥信息',
  'security.allow_private_urls': '允许私有地址',
  'browser.allow_private_urls': '浏览器私有地址',
  'browser.auto_local_for_private_urls': '私有地址自动使用本地浏览器',
  'checkpoints.enabled': '文件检查点',
  'checkpoints.max_snapshots': '检查点上限',
  'voice.record_key': '语音快捷键',
  'voice.max_recording_seconds': '最长录音时长',
  'voice.auto_tts': '自动朗读回复',
  'stt.enabled': '语音转文字',
  'stt.provider': '语音转文字提供商',
  'stt.local.model': '本地转录模型',
  'stt.local.language': '转录语言',
  'stt.elevenlabs.model_id': 'ElevenLabs STT 模型',
  'stt.elevenlabs.language_code': 'ElevenLabs 语言',
  'stt.elevenlabs.tag_audio_events': '标记音频事件',
  'stt.elevenlabs.diarize': '说话人分离',
  'tts.provider': '文字转语音提供商',
  'tts.edge.voice': 'Edge 语音',
  'tts.openai.model': 'OpenAI TTS 模型',
  'tts.openai.voice': 'OpenAI 语音',
  'tts.elevenlabs.voice_id': 'ElevenLabs 语音',
  'tts.elevenlabs.model_id': 'ElevenLabs 模型',
  'memory.memory_enabled': '持久化记忆',
  'memory.user_profile_enabled': '用户画像',
  'memory.memory_char_limit': '记忆容量',
  'memory.user_char_limit': '画像容量',
  'memory.provider': '记忆提供商',
  'context.engine': '上下文引擎',
  'compression.enabled': '自动压缩',
  'compression.threshold': '压缩阈值',
  'compression.target_ratio': '压缩目标比例',
  'compression.protect_last_n': '保护最近消息数',
  'agent.api_max_retries': 'API 重试次数',
  'agent.service_tier': '服务等级',
  'agent.tool_use_enforcement': '工具使用强制',
  'delegation.model': '子代理模型',
  'delegation.provider': '子代理提供商',
  'delegation.max_iterations': '子代理轮次上限',
  'delegation.max_concurrent_children': '并行子代理数',
  'delegation.child_timeout_seconds': '子代理超时',
  'delegation.reasoning_effort': '子代理推理力度',
  'auxiliary.vision.provider': '视觉提供商',
  'auxiliary.vision.model': '视觉模型',
  'auxiliary.compression.provider': '压缩提供商',
  'auxiliary.compression.model': '压缩模型',
  'auxiliary.title_generation.provider': '标题提供商',
  'auxiliary.title_generation.model': '标题模型'
}

export const FIELD_DESCRIPTIONS: Record<string, string> = {
  model: '用于新建对话，除非你在输入框中选择了其他模型。',
  model_context_length: '设为 0 则使用所选模型自动检测的上下文窗口。',
  fallback_providers: '默认模型失败时尝试的备用提供商:模型条目。',
  'display.personality': '新会话的默认助手风格。',
  timezone: '当 Hermes 需要本地时间上下文时使用。留空则使用系统时区。',
  'display.show_reasoning': '当后端提供推理内容时显示推理过程。',
  'agent.image_input_mode': '控制图片附件如何发送给模型。',
  'terminal.cwd': '工具和终端工作的默认项目文件夹。',
  'code_execution.mode': '代码执行对当前项目范围的限制严格程度。',
  'terminal.persistent_shell': '后端支持时在命令之间保持 Shell 状态。',
  'terminal.env_passthrough': '传递给工具执行的环境变量。',
  file_read_max_chars: 'Hermes 单次文件读取的最大字符数。',
  'approvals.mode': 'Hermes 处理需要明确批准的命令的方式。',
  'approvals.timeout': '批准提示在超时前的等待时间。',
  'security.redact_secrets': '尽可能对模型可见内容隐藏检测到的密钥。',
  'checkpoints.enabled': '在文件编辑前创建回滚快照。',
  'memory.memory_enabled': '保存可持久化的记忆，以帮助未来的会话。',
  'memory.user_profile_enabled': '维护用户偏好的精简画像。',
  'context.engine': '管理接近上下文限制的长对话的策略。',
  'compression.enabled': '当对话过长时总结较旧的上下文。',
  'voice.auto_tts': '自动朗读助手的回复。',
  'stt.enabled': '启用本地或提供商支持的语音转录。',
  'stt.elevenlabs.language_code': '可选的 ISO-639-3 语言代码。留空让 ElevenLabs 自动检测。',
  'agent.max_turns': 'Hermes 在停止运行前的工具调用轮次上限。'
}

// Curated desktop config surface: only fields a user might tune from the app.
export const SECTIONS: DesktopConfigSection[] = [
  {
    id: 'model',
    label: '模型',
    icon: Sparkles,
    keys: ['model', 'model_context_length', 'fallback_providers']
  },
  {
    id: 'chat',
    label: '对话',
    icon: MessageCircle,
    keys: ['display.personality', 'timezone', 'display.show_reasoning', 'agent.image_input_mode']
  },
  {
    id: 'appearance',
    label: '外观',
    icon: Palette,
    keys: []
  },
  {
    id: 'workspace',
    label: '工作区',
    icon: Monitor,
    keys: [
      'terminal.cwd',
      'code_execution.mode',
      'terminal.persistent_shell',
      'terminal.env_passthrough',
      'file_read_max_chars'
    ]
  },
  {
    id: 'safety',
    label: '安全',
    icon: Lock,
    keys: [
      'approvals.mode',
      'approvals.timeout',
      'approvals.mcp_reload_confirm',
      'command_allowlist',
      'security.redact_secrets',
      'security.allow_private_urls',
      'browser.allow_private_urls',
      'browser.auto_local_for_private_urls',
      'checkpoints.enabled'
    ]
  },
  {
    id: 'memory',
    label: '记忆与上下文',
    icon: Brain,
    keys: [
      'memory.memory_enabled',
      'memory.user_profile_enabled',
      'memory.memory_char_limit',
      'memory.user_char_limit',
      'memory.provider',
      'context.engine',
      'compression.enabled',
      'compression.threshold',
      'compression.target_ratio',
      'compression.protect_last_n'
    ]
  },
  {
    id: 'voice',
    label: '语音',
    icon: Mic,
    keys: [
      'tts.provider',
      'stt.enabled',
      'stt.provider',
      'voice.auto_tts',
      'tts.edge.voice',
      'tts.openai.model',
      'tts.openai.voice',
      'tts.elevenlabs.voice_id',
      'tts.elevenlabs.model_id',
      'stt.local.model',
      'stt.local.language',
      'stt.elevenlabs.model_id',
      'stt.elevenlabs.language_code',
      'stt.elevenlabs.tag_audio_events',
      'stt.elevenlabs.diarize',
      'voice.record_key',
      'voice.max_recording_seconds'
    ]
  },
  {
    id: 'advanced',
    label: '高级',
    icon: Wrench,
    keys: [
      'toolsets',
      'terminal.backend',
      'terminal.timeout',
      'tool_output.max_bytes',
      'tool_output.max_lines',
      'tool_output.max_line_length',
      'checkpoints.max_snapshots',
      'agent.max_turns',
      'agent.api_max_retries',
      'agent.service_tier',
      'agent.tool_use_enforcement',
      'delegation.model',
      'delegation.provider',
      'delegation.max_iterations',
      'delegation.max_concurrent_children',
      'delegation.child_timeout_seconds',
      'delegation.reasoning_effort',
      'auxiliary.vision.provider',
      'auxiliary.vision.model',
      'auxiliary.compression.provider',
      'auxiliary.compression.model',
      'auxiliary.title_generation.provider',
      'auxiliary.title_generation.model'
    ]
  }
]

export interface ModeOption {
  id: ThemeMode
  label: string
  description: string
  icon: IconComponent
}

export const MODE_OPTIONS: ModeOption[] = [
  { id: 'light', label: '浅色', description: '明亮的桌面界面', icon: Sun },
  { id: 'dark', label: '深色', description: '低眩光的工作环境', icon: Moon },
  { id: 'system', label: '跟随系统', description: '跟随系统外观设置', icon: Monitor }
]

export const SEARCH_PLACEHOLDER: Record<
  'about' | 'config' | 'gateway' | 'keys' | 'mcp' | 'sessions' | 'tools',
  string
> = {
  about: '关于 Hermes 桌面版',
  config: '搜索设置…',
  gateway: '搜索网关连接…',
  keys: '搜索 API 密钥…',
  mcp: '搜索 MCP 服务器…',
  sessions: '搜索已归档会话…',
  tools: '搜索技能和工具…'
}
