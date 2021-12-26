### React Toastify 클론 해보기

기본 기능
- [ ] 버튼을 누르면 오른쪽 상단에 토스트 메세지가 보인다.
- [ ] X 버튼을 누르면 토스트 메세지가 꺼진다.
- [ ] 버튼을 여러번 누르면 토스트 메세지가 쌓인다.
- 특정 시간이 지난 후 꺼짐


추가해볼 수 있는 것들
- 테스트
- 커스텀 스타일 적용
- 토스트 메세지 위치 변경


## Details

ToastContainer들은 mount 될 때 각각의 collection<RefObject>를 가진다. (useToastContainter 참고)

```ts
type CollectionItem = Record<Id, Toast>
const collection = useKeeper<CollectionItem>({})
```

key를 Id로 하고, value에 보여줄 ToastContent와 ToastProps를 추가한다.
