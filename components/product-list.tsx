"use client";

import { initialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initialProducts: initialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  // 부모(서버 컴포넌트)가 불러온 이니셜 제품 데이터로 상태 초기화하기
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  // 현재 페이지
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  // 최초 렌더링 & page 상태 변경 시 마다 trigger observe
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        // observer가 관측할 요소들
        entries: IntersectionObserverEntry[],
        // observer 그 자체
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        // 사용자의 뷰에 트리거가 감지되면
        if (element.isIntersecting && trigger.current) {
          // 옵저버 감시 중지
          observer.unobserve(trigger.current);

          // 데이터 불러오기
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);

          // 더이상 가져올 데이터가 없을때에만 page 증가 금지
          if (newProducts.length !== 0) {
            setPage((pre) => pre + 1);
            setProducts((prevProducts) => [...prevProducts, ...newProducts]);
          } else {
            setIsLastPage(true);
          }

          setIsLoading(false);
        }
      },
      {
        // 트리거가 전부 다 보여야 화면에 있다고 표시하기
        threshold: 1.0,
      }
    );

    if (trigger.current) {
      // 트리거 span 감시 시작
      observer.observe(trigger.current);
    }

    // clean-up
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5 mb-20">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage && (
        <span ref={trigger} className="text-white mx-auto">
          {isLoading ? "로딩 중.." : "더 불러오기"}
        </span>
      )}
    </div>
  );
}
