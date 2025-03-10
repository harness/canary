function InputWrapper({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
  return (
    <div style={{ padding: '5px' }} className="flex">
      {children}
    </div>
  )
}

export default InputWrapper
