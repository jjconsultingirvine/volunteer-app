// Import your publishable key
const clerk_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerk_key) {
  throw new Error("Missing Publishable Key")
}
export default clerk_key;