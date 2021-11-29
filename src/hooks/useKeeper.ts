import { useRef, useEffect } from 'react'

// 값을 유지 하고 싶은 arg가 있다면 useKeeper로 만들어서 값을 유지시킬 수 있음
function useKeeper<T>(arg:T, refresh= false) {
  const ref = useRef<T>(arg)

  useEffect(() => {
    if(refresh) ref.current = arg
  })

  return ref.current
}

export default useKeeper
