export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'short_text'
  | 'essay'
  | 'formula'
  | 'matching'
  | 'ordering'
  | 'fill_blanks'
  | 'file_upload';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_type: QuestionType;
  prompt: string;
  options?: string[]; // for choice questions
  correct_answers?: string[]; // for auto grading
  matching_pairs?: MatchingPair[]; // for matching questions
  ordering_items?: string[]; // for sequence questions
  fill_blanks_text?: string; // e.g. "Астана — [[Қазақстанның]] астанасы"
  rubric?: string; // for AI evaluation of essays
  points: number;
  order_index: number;
}

export interface Exam {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  pin_code?: string;
  time_limit_minutes: number;
  max_attempts: number;
  is_active: boolean;
  enforce_fullscreen: boolean;
  block_tab_switch: boolean;
  allow_calculator: boolean;
  created_at: string;
  questions?: Question[];
}

export type ProctorEventType =
  | 'tab_switch'
  | 'fullscreen_exit'
  | 'copy_attempt'
  | 'multi_device'
  | 'focus_lost';

export interface ProctorLog {
  id: string;
  submission_id: string;
  event_type: ProctorEventType;
  details: string;
  duration_seconds: number;
  created_at: string;
}

export interface Submission {
  id: string;
  exam_id: string;
  student_id: string;
  student_name?: string;
  session_token: string;
  status: 'in_progress' | 'completed' | 'terminated';
  total_score: number;
  violation_count: number;
  started_at: string;
  completed_at?: string;
}
