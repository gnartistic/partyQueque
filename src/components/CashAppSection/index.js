import React from 'react';
import { Heading, Flex, Link } from '@chakra-ui/react';
import { themeAtom } from "../../atoms/theme";
import { useAtom } from 'jotai';
import theme from "../../theme";
function CashAppSection ()
{
    const [ themeName, setThemeName ] = useAtom( themeAtom );
    const activeTheme = theme.colors[ themeName ] || theme.colors.black;
  return (
    <Flex className='cashapp-container' flexDirection="column" width="100%" justifyContent="center" gap={6} alignItems="center">
      <Heading  color={activeTheme.primary} className='message'>Support the DJ!
      </Heading>
      <Link _hover={{textDecoration: "none"}} bg={activeTheme.primary} borderRadius="30px" px={8} py={4} color={activeTheme.background} className='cashapp-link' fontSize={{base: "18px", lg:"22px"}} href='https://cash.app/$MrHoustxn'> CashApp: $MrHoustxn
        </Link>
    </Flex>
  );
}

export default CashAppSection;
