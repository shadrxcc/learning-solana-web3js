import Link from "next/link";

function Nav() {
  return (
    <>
      <div>
        <div className="flex items-center gap-x-3 justify-center">
          <Link href={``}>
            <p className="text-xs">Generate Key Pair</p>
          </Link>

          <Link href={`transfer`}>
            <p className="text-xs">Transaction Sender</p>
          </Link>

          <Link href={`wallet-interaction`}>
            <p className="text-xs">Wallet Interaction</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Nav;
