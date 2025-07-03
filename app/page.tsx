import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image
        src="/images/star-1.png"
        alt="star-1"
        width={216}
        height={216}
        className="absolute top-[36px] left-[120px] rotate-[18deg] z-[2]"
      />
      <Image
        src="/images/love-pixel.png"
        alt="love-pixel"
        width={240}
        height={198}
        className="absolute top-[32px] left-[1120px] rotate-[18deg] z-[2]"
      />
      <Image
        src="/images/flower-1.png"
        alt="flower-1"
        width={348}
        height={348}
        className="fixed bottom-[-72px] left-[-54px]"
      />
      <div className="flex flex-col justify-center items-center mb-[-720px] relative z-[1]">
        <Image
          src="/images/paper-1.png"
          alt="paper-1"
          width={1180}
          height={896}
        />
      </div>
      <div className="flex flex-col justify-center items-center relative z-[2]">
        <Image
          src="/images/star-2.png"
          alt="star-2"
          width={645}
          height={320}
          className="mb-[-420px]"
        />
        <h1 className="text-[140px] text-pink-300 [text-shadow:14px_4px_0_#f45394] text-center rotate-[-7deg] z-[2] relative">
          Lorem
        </h1>
        <h1 className="text-[160px] text-pink-300 [text-shadow:14px_4px_0_#f45394] text-center rotate-[-7deg] mt-[-100px] z-[2] relative">
          Ipsum?
        </h1>
        <button className="w-52 bg-pink-500 shadow-pink-300 shadow h-24 rounded-full hover:bg-pink-600 hover:scale-105 duration-100"></button>
      </div>
      <Image
        src="/images/pointer.png"
        alt="pointer"
        width={104}
        height={136}
        className="absolute top-[672px] left-[783px] z-[2]"
      />
      <Image
        src="/images/paper-2.png"
        alt="paper-2"
        width={548}
        height={320}
        className="fixed bottom-0 right-0"
      />
    </div>
  );
}
