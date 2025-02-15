/** Parallel Routes
 *
 * "@name" 폴더 설정해서 "어떤 url 루트" 에서만 보여지는 특정 컴포넌트를 작성 가능하다.
 * layout.tsx에서 props를 받아서 보여주면 된다.
 *
 * 현재는 /products/[id]를 인터셉트할때만 모달이 보여야하니
 * default -> return null을 통해 404 에러가 뜨지않게 한다
 */
export default function HomeLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
