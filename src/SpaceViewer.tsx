import { FC, useEffect, useState, useRef } from "react";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { Space } from "@smplrspace/smplr-loader/dist/generated/smplr";

import { Icon, icons, ParkingSlot, parkingSlots } from "../data/data.ts";

import "./style.css";

interface SpaceViewerProps {
  parkingSlotSearched: number | undefined;
}

export const SpaceViewer: FC<SpaceViewerProps> = ({ parkingSlotSearched }) => {
  const spaceRef = useRef<Space>();
  const [viewerReady, setViewerReady] = useState(false);

  const [hasZoomedOut, setHasZoomedOut] = useState(false);

  const setCameraPlacementOnParkingSlot = (parkingSlot: ParkingSlot) => {
    const currentCameraPlacement = spaceRef.current?.getCameraPlacement();

    spaceRef.current?.setCameraPlacement({
      ...currentCameraPlacement,
      target: {
        x: parkingSlot.coordinates[0][0].x,
        z: parkingSlot?.coordinates[0][0].z,
        y: 5,
      },
      animate: true,
      animationDuration: 1,
    });
  };

  useEffect(() => {
    loadSmplrJs()
      .then((smplr) => {
        spaceRef.current = new smplr.Space({
          spaceId: import.meta.env.VITE_SPACE_ID,
          clientToken: import.meta.env.VITE_CLIENT_TOKEN,
          containerId: "parking-jdg",
        });

        spaceRef.current.startViewer({
          preview: false,
          loadingMessage: "Parking en cours de chargement...",
          mode: "3d",
          onReady: () => setViewerReady(true),
          onError: (error: unknown) => console.error("Could not start viewer", error),
          cameraPlacement: {
            alpha: -3.1259822158605868,
            beta: 0.015531250000000104,
            radius: 154.31032116937382,
            target: {
              x: 145.3335497549733,
              y: 5,
              z: -77.33947423912399,
            },
          },
          hideNavigationButtons: true,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!viewerReady) {
      return;
    }

    if (!hasZoomedOut) {
      spaceRef.current?.zoomOut();
      setHasZoomedOut(true);
    }

    spaceRef.current?.addDataLayer<ParkingSlot>({
      id: "places",
      type: "polygon",
      data: parkingSlots,
      tooltip: (d: ParkingSlot) => d.name,
      color: (d: ParkingSlot) => (Number(d.name.replace(/^\D+/g, "")) === parkingSlotSearched ? "#40A9FF" : "#818181"),
      alpha: 1,
      height: 0.25,
      onClick: (d: ParkingSlot) => {
        setCameraPlacementOnParkingSlot(d);
      },
    });

    if (parkingSlotSearched) {
      const parkingSlot = parkingSlots.find((slot) => Number(slot.name.replace(/^\D+/g, "")) === parkingSlotSearched);

      if (!parkingSlot) {
        return;
      }

      setCameraPlacementOnParkingSlot(parkingSlot as ParkingSlot);
    }

    icons.forEach((icon) => {
      spaceRef.current?.addDataLayer<Icon>({
        id: icon.id,
        type: "icon",
        data: [
          {
            ...icon,
            position: {
              ...icon.position,
              elevation: 2,
            },
          },
        ],
        icon: {
          url: icon.image,
          width: 150,
          height: 150,
        },
        width: 3,
      });
    });

    return () => {
      spaceRef.current?.removeDataLayer("places");
      icons.forEach((icon) => {
        spaceRef.current?.removeDataLayer(icon.id);
      });
    };
  }, [viewerReady, parkingSlotSearched, hasZoomedOut]);

  return (
    <div className="smplr-wrapper">
      <div id="parking-jdg" className="smplr-embed"></div>
    </div>
  );
};
