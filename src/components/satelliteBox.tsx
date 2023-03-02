import type { Satellite } from "@prisma/client";
import Link from "next/link";

const SatelliteBox: React.FC<{
  satellite: Satellite;
}> = ({ satellite }) => {
  return (
    <div
      key={satellite.id}
      className="flex flex-col rounded-lg bg-[#00000077] p-[1rem]"
    >
      <div className="my-3">
        <p>
          {satellite.sideNumber} - {satellite.model}
        </p>
        <p>{satellite.manufacturer}</p>
      </div>
      <div className="flex justify-around">
        <Link href={`/satellites/${satellite.id}`} className="btn">
          Show
        </Link>
      </div>
    </div>
  );
};

export default SatelliteBox;
