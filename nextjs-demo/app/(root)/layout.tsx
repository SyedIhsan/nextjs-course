const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>Main Dashboard</p>
      {children}
    </div>
  )
}

export default Layout