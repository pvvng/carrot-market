import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  ClockIcon,
  HeartIcon,
  PencilSquareIcon,
  ReceiptRefundIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type CardIconType =
  | "heart"
  | "recent"
  | "sell"
  | "purchase"
  | "post"
  | "receivedReview"
  | "givenReview";

interface Props {
  icon: CardIconType;
  text: string;
  link: string;
}

export default function ProfileCard({ icon, text, link }: Props) {
  const icons = {
    heart: <HeartIcon />,
    recent: <ClockIcon />,
    sell: <ReceiptRefundIcon />,
    purchase: <ShoppingBagIcon />,
    post: <PencilSquareIcon />,
    givenReview: <SparklesIcon />,
    receivedReview: <UsersIcon />,
  };

  return (
    <Link
      href={link}
      className="*:text-white hover:bg-neutral-700 rounded-md transition-colors p-1 py-1.5"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="*:size-6">{icons[icon]}</span>
          <p className="font-medium">{text}</p>
        </div>
        <ChevronRightIcon className="size-6" />
      </div>
    </Link>
  );
}
