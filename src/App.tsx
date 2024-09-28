import { useEffect, useState } from "react";
import { SpaceViewer } from "./SpaceViewer";
import { parkingSlots } from "../data/data";

import { FormControl, FormErrorMessage, FormLabel, IconButton, NumberInput, NumberInputField, useToast } from "@chakra-ui/react";

import SearchIcon from "./assets/search_icon.svg";
import ShareIcon from "./assets/share_icon.svg";

const PLACES_NUMBERS = parkingSlots.map((slot) => {
  const name = slot.name;
  const lastNamePart = name.split(" ")[1];

  if (!isNaN(Number(lastNamePart))) {
    return parseInt(lastNamePart);
  }
});

export type ParkingSlotSearched = { numberPlace: number | undefined };

function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const parkingSlotFromUrl = queryParameters.get("place");

  const toast = useToast();

  const [parkingSlot, setParkingSlot] = useState<ParkingSlotSearched>({ numberPlace: undefined });
  const [numberInputValue, setNumberInputValue] = useState<number | undefined>(parkingSlotFromUrl ? Number(parkingSlotFromUrl) : undefined);

  useEffect(() => {
    if (parkingSlotFromUrl) {
      const parsedParkingSlot = Number(parkingSlotFromUrl);

      if (PLACES_NUMBERS.includes(parsedParkingSlot)) {
        setParkingSlot({ numberPlace: parsedParkingSlot });
      }
    }
  }, [parkingSlotFromUrl]);

  const isParkingNumberGood = (number: number | undefined | typeof NaN) => {
    if (number === undefined) {
      return true;
    }

    if (isNaN(number)) {
      return false;
    }

    return PLACES_NUMBERS.includes(number);
  };

  const parkingSlotError = !isParkingNumberGood(parkingSlot.numberPlace);
  const numberInputValueError = !isParkingNumberGood(numberInputValue);

  const onSubmit = () => {
    setParkingSlot({ numberPlace: numberInputValue });
  };

  return (
    <div className="container">
      <SpaceViewer parkingSlotSearched={parkingSlot} />
      <form onSubmit={(e) => e.preventDefault()}>
        <FormControl className="search-container" isInvalid={numberInputValueError} onSubmit={onSubmit}>
          <FormLabel color="teal.700" margin={0}>
            N° de place :
          </FormLabel>
          <div className="number-input-container">
            <NumberInput
              flex={1}
              keepWithinRange={false}
              clampValueOnBlur={false}
              onChange={(_, value) => {
                setNumberInputValue(value);
              }}
              focusBorderColor={numberInputValueError ? "red.400" : "teal.500"}
              errorBorderColor="red.400"
              backgroundColor="gray.100"
              borderRadius={10}
              isInvalid={numberInputValueError}
              defaultValue={numberInputValue}
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
              isDisabled={numberInputValueError || typeof numberInputValue !== "number"}
            />
          </div>
          <FormErrorMessage margin={0}>Ce numéro de place n'existe pas.</FormErrorMessage>
        </FormControl>
      </form>
    </div>
  );
}

export default App;
