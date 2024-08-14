import { useState } from "react";
import { SpaceViewer } from "./SpaceViewer";

import { NumberInput, NumberInputField } from "@chakra-ui/react";

const MIN_NUMBER_OF_PARKING_SLOTS = 1;
const MAX_NUMBER_OF_PARKING_SLOTS = 136;

function App() {
  const [parkingSlot, setParkingSlot] = useState<number | undefined>(undefined);

  const parkingSlotError = parkingSlot !== undefined && (parkingSlot < MIN_NUMBER_OF_PARKING_SLOTS || parkingSlot > MAX_NUMBER_OF_PARKING_SLOTS);

  return (
    <div className="container">
      <SpaceViewer parkingSlot={parkingSlot} />
      <div className="container-input">
        <p className="place-number">N° de la place :</p>
        <NumberInput
          min={MIN_NUMBER_OF_PARKING_SLOTS}
          max={MAX_NUMBER_OF_PARKING_SLOTS}
          keepWithinRange={false}
          clampValueOnBlur={false}
          onChange={(_, value) => {
            setParkingSlot(value);
          }}
          focusBorderColor={parkingSlotError ? "red.400" : "blue.300"}
          errorBorderColor="red.400"
          backgroundColor="gray.100"
          borderRadius={10}
          isInvalid={parkingSlotError}
        >
          <NumberInputField />
        </NumberInput>
        {parkingSlotError && <p className="error-message">Ce numéro de place n'existe pas.</p>}
      </div>
    </div>
  );
}

export default App;
