const interests = [
    "Low-income support",
    "Environmental",
    "Crisis",
    "Health and Wellness",
    "Education",
    "Youth Development",
    "Senior Care",
    "Community Development",
    "Arts",
    "Disability Services",
    "Advocacy",
    "Animal care",
];

const skill_sets = [
    "Physical",
    "Intellectual",
    "Creative",
    "Interpersonal",
    "Managerial",
    "Technical",
    "Medical",
];

interface User {
    name: string
    user_id: string
    random_id: number
    skills: string[]
    interests: string[]
    saved: string[]
    pfp?: string
    description?: string
}

interface Experience {
    duration: number
    role: string
    random_user_id: number
    org_name: string
    time: Date
}

interface Role {
    name: string
    skills: string[]
    details: string
    interest?: string
    requirements?: string[]
    link?: string
}

interface Organization {
    name: string
    url_name: string
    short_desc: string
    long_desc: string
    interest: string

    general_requirements: string[]
    keywords: string[]
    roles: Role[]

    website?: string
    address?: string
    phone?: string
    email?: string
    sign_up?: string
    pfp?: string
}

export { interests, skill_sets };
export type { Organization, Role, Experience, User };