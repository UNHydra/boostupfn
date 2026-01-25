"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    // route değişince key değişsin -> animasyon tetiklensin
    setKey(pathname);
  }, [pathname]);

  return (
    <div
      key={key}
      className={[
        "animate-pageIn",
        "will-change-[opacity,transform,filter]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
