import Link from "next/link"

const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <Link href="dashboard/analytics">Analytics</Link>
      <Link href="dashboard/users">Users</Link>
    </div>
  )
}

export default Dashboard