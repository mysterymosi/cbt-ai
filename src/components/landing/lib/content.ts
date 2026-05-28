import {
  BookOpenCheckIcon,
  DatabaseIcon,
  GraduationCapIcon,
  Layers3Icon,
  MessageCircleQuestionIcon,
  MousePointerClickIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

export const answerOptions = [
  { label: "A", text: "Oxygen" },
  { label: "B", text: "Hydrogen", selected: true },
  { label: "C", text: "Nitrogen" },
  { label: "D", text: "Carbon dioxide" },
]

export const heroStats = [
  { label: "Subjects in beta", value: "7" },
  { label: "Current mode", value: "Practice" },
  { label: "Tutor timing", value: "Post-answer" },
]

export const workflow = [
  {
    icon: TargetIcon,
    title: "Choose a focus",
    text: "Pick UTME, one of the supported subjects, and a short practice count.",
  },
  {
    icon: MousePointerClickIcon,
    title: "Submit your answer",
    text: "Answer one question at a time and get immediate grading feedback.",
  },
  {
    icon: MessageCircleQuestionIcon,
    title: "Ask why",
    text: "Open the tutor after submission for a grounded explanation tied to the exact question.",
  },
]

export const outcomes = [
  {
    icon: DatabaseIcon,
    title: "Cached question base",
    text: "ALOC questions are normalized into Supabase before practice sessions use them.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by default",
    text: "Question sync keys, service role keys, and tutor credentials stay server-side.",
  },
  {
    icon: TrendingUpIcon,
    title: "Progress-ready",
    text: "Sessions, attempts, reports, tutor threads, and usage logs are already modeled.",
  },
]

export const tutorPrompts = [
  { icon: SparklesIcon, text: "Explain simply" },
  { icon: BookOpenCheckIcon, text: "Why was I wrong?" },
  { icon: Layers3Icon, text: "What topic is this?" },
  { icon: GraduationCapIcon, text: "Give a similar one" },
]
