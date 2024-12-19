import { Link, useMatches } from 'react-router-dom'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <nav className="mb-4 flex items-start gap-1">
      {/**
       * Fixed/Default links
       */}
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      {matches.map((match, index) => {
        // @ts-expect-error
        const { breadcrumb } = match.handle || {}
        const isLast = index === matches.length - 1

        if (!breadcrumb) return null

        return (
          <div key={match.pathname} className="flex">
            <span className="ml-1 mr-1">/</span>
            {isLast ? (
              breadcrumb(match.params)
            ) : (
              <Link to={match.pathname} className="text-blue-500 hover:underline">
                {breadcrumb(match.params)}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs
