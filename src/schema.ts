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
    pfp: string
    random_id: number
    user_id: string
    skills: string[]
    interests: string[]
    description: string
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
}

interface Organization {
    name: string
    website: string
    short_desc: string
    long_desc: string
    volunteer_requirements: string
    keywords: string[]
    address: string
    phone: string
    email: string
    sign_up: string
    pfp: string
    pretty_name: string
}

export { interests, skill_sets };
export type { Organization, Role, Experience, User };