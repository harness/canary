import React from 'react'

function Root() {
  return (
    <div className="grid grid-rows-2 grid-cols-[auto_1fr] gap-x-3 items-center justify-start cursor-pointer">
      <div className="col-start-1 row-span-2">
        <div className="h-9 w-9 bg-cover rounded-md overflow-hidden" />
      </div>
      <p className="col-start-2 row-start-1 text-xs text-primary font-medium">Steven M.</p>
      <p className="col-start-2 row-start-2 text-xs font-normal text-tertiary-background">Admin</p>
    </div>
  )
}

export { Root }
