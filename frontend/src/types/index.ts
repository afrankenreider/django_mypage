export interface Project {
  id: number
  project_title: string
  description: string
  technology: 'Python' | 'API' | 'Automation' | 'Modeling'
  repository: string | null
  image: string | null
}

export interface Skill {
  name: string
  icon: string
  category: string
  url: string
}
