/** Intercepting Routes
 *
 *
 * (..)은 현재 위치 (/home)에서 상위 url (/) 로 이동한다는 의미
 * 그래서 (..)products/[id]는 /products/[id]랑 같음
 *
 * /home에서 /product/[id] 로 사용자가 이동하면
 * 아래 컴포넌트를 대신 보여줌
 */
export default function Modal() {
  return <div>hi modal</div>;
}
