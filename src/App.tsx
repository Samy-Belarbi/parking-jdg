import { useEffect, useState } from "react";
import { SpaceViewer } from "./SpaceViewer";

import { FormControl, FormErrorMessage, FormLabel, IconButton, NumberInput, NumberInputField, useToast } from "@chakra-ui/react";

import SearchIcon from "./assets/search_icon.svg";
import ShareIcon from "./assets/share_icon.svg";

const MIN_NUMBER_OF_PARKING_SLOTS = 1;
const MAX_NUMBER_OF_PARKING_SLOTS = 136;

export type ParkingSlotSearched = { numberPlace: number | undefined };

function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const parkingSlotFromUrl = queryParameters.get("place");

  const toast = useToast();

  const [parkingSlot, setParkingSlot] = useState<ParkingSlotSearched>({ numberPlace: undefined });
  const [numberInputValue, setNumberInputValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (parkingSlotFromUrl) {
      const parsedParkingSlot = parseInt(parkingSlotFromUrl, 10);

      if (parsedParkingSlot >= MIN_NUMBER_OF_PARKING_SLOTS && parsedParkingSlot <= MAX_NUMBER_OF_PARKING_SLOTS) {
        setParkingSlot({ numberPlace: parsedParkingSlot });
        setNumberInputValue(parsedParkingSlot);
      }
    }
  }, [parkingSlotFromUrl]);

  const isParkingNumberWrong = (number: number | undefined | typeof NaN) => {
    if (number === undefined) {
      return false;
    }

    const isNan = isNaN(number);

    if (isNan) {
      return true;
    }

    return number < MIN_NUMBER_OF_PARKING_SLOTS || number > MAX_NUMBER_OF_PARKING_SLOTS;
  };

  const parkingSlotError = isParkingNumberWrong(parkingSlot.numberPlace);

  const onSubmit = () => {
    setParkingSlot({ numberPlace: numberInputValue });
  };

  return (
    <div className="container">
      <SpaceViewer parkingSlotSearched={parkingSlot} />
      <form onSubmit={(e) => e.preventDefault()}>
        <FormControl className="search-container" isInvalid={parkingSlotError} onSubmit={onSubmit}>
          <FormLabel color="teal.700" margin={0}>
            N° de place :
          </FormLabel>
          <div className="number-input-container">
            <NumberInput
              min={MIN_NUMBER_OF_PARKING_SLOTS}
              max={MAX_NUMBER_OF_PARKING_SLOTS}
              keepWithinRange={false}
              clampValueOnBlur={false}
              onChange={(_, value) => {
                setNumberInputValue(value);
              }}
              focusBorderColor={parkingSlotError ? "red.400" : "teal.500"}
              errorBorderColor="red.400"
              backgroundColor="gray.100"
              borderRadius={10}
              isInvalid={parkingSlotError}
              defaultValue={parkingSlotFromUrl ?? undefined}
            >
              <NumberInputField />
            </NumberInput>
            <IconButton aria-label="search" colorScheme="teal" onClick={onSubmit} type="submit" icon={<img src={SearchIcon} alt="search" width="25" />} aria-invalid={parkingSlotError} />
            <IconButton
              aria-label="share"
              colorScheme="teal"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}?place=${numberInputValue}`);
                toast({
                  title: "Lien copié dans le presse-papier !",
                  description: `Vous pouvez maintenant partager la localisation de votre place numéro ${numberInputValue}.`,
                  colorScheme: "teal",
                  status: "success",
                  duration: 8000,
                  isClosable: true,
                });
              }}
              icon={<img src={ShareIcon} alt="search" width="19" />}
              isDisabled={parkingSlotError || isParkingNumberWrong(numberInputValue) || typeof numberInputValue !== "number" || isNaN(numberInputValue)}
            />
          </div>
          <FormErrorMessage margin={0}>Ce numéro de place n'existe pas.</FormErrorMessage>
        </FormControl>
      </form>
    </div>
  );
}

export default App;
