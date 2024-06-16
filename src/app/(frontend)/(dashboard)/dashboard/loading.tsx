export default function Loading() {
  return (
    <div className="w-full h-[calc(100dvh-50px)] flex justify-center items-center ">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
