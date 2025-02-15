/** Intercepting Routes
 *
 *
 * (..)은 현재 위치 (/home)에서 상위 url (/) 로 이동한다는 의미
 * 그래서 (..)products/[id]는 /products/[id]랑 같음
 *
 * 만약에 현재 루트가 /products이고 /products/[id]를 인터셉트하기 위해선
 * (.)[id] 를 사용하면 됨
 *
 * /home에서 /product/[id] 로 사용자가 이동하면
 * 아래 컴포넌트를 대신 보여줌
 */
export default function Modal() {
  return <div>hi modal</div>;
}
