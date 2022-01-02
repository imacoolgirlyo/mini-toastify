import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ToastContainer, toast } from '../src/index';

const App = () => {
  const handleButtonClick = () => {
    // 아래 toast를 호출하는 함수 실행
    // 어떤 ToastContainer를 보여줄지 toast 함수에는 전달하지 않는데 어떻게 특정 토스트를 보여주는 거지?
    toast('hello');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Show me the Toast!</button>
      <ToastContainer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
