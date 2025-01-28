import React from 'react';
import {
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalBody,
ModalFooter,
Button,
Text,
Flex,
} from '@chakra-ui/react';
import CashAppSection from '@/components/CashAppSection';
import { themeAtom } from "@/atoms/theme";
import { useAtom } from 'jotai';
import theme from "@/theme";

const TipModal = ({ isOpen, onClose }: any) => {
  const [themeName] = useAtom(themeAtom);
  const activeTheme = theme.colors[themeName] || theme.colors.black;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay css={{
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0)",
      }} />
      <ModalContent bg={activeTheme.background} color="black" borderRadius={{ base: "0px", lg: "20px" }} height={{ base: "100vh", lg: "400px" }} width={{ base: "100vw", lg: "450px" }} >
        <Flex height="400px" justifyContent="center" alignItems="center">
          <CashAppSection />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default TipModal;