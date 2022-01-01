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

ToastContainer는 mount 될 때, eventManager에 `Event.Show`를 등록한다. (useToastContainer) 그리고 `toast` 함수는 Event.Show 이벤트를 emit 하는 역할을 하는데 이를 통해 화면에 토스트가 보여지게 된다. 즉 컴포넌트가 mount 될 때 Event.Show event를 기다리고 있다가 toast 팡하고 실행 되는 순간 토스트 UI를 만드는 함수가 실행이 된다. (dispatch)

eventManager에 event를 등록할 때, 이벤트 이름과 callback 함수를 함께 전달하게 되는데 이 callback 함수는 실질적으로 Toast를 만드는 역할을 한다.

ToastContainer들은 mount 될 때 각각의 collection<RefObject>를 가진다. (useToastContainter 참고)

```ts
type CollectionItem = Record<Id, Toast>;
const collection = useKeeper<CollectionItem>({});
```

key를 Id로 하고, value에 보여줄 ToastContent와 ToastProps를 추가한다.

## Test 시나리오

### ToastContainer

ToastContainer가 mount 되면 Event.Show가 등록되는지 확인
