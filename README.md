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

## Test 시나리오

### ToastContainer

1. ToastContainer가 mount 되면 Event.Show가 등록되는지 확인

실질적으로 ToastContainer DidMount시에는 Event.Show가 emit 된다. `core/toast` 제일 하단에서 Event.DidMount 이벤트를 기다리는 on 함수를 등록시켰다.

- 테스트 코드를 적으려하니 아무리 실행해도 통과가 안되길래 살펴봤더니 toast 파일을 import 하지 않아서 Event.DidMount 이벤트 자체가 등록되지 않았었다. 암튼 새로운 방식..

## Styles

동적으로 조건에 따라 className을 만들어주기 위해 [clsx](https://www.npmjs.com/package/clsx) 라는 모듈을 사용했다. syntax를 이해하기 어렵지 않으나
가독성이 좀 떨어져보이긴한다. 기능이 많지 않아서 그런지 라이브러리 자체가 매우 경량(228B)이다.
