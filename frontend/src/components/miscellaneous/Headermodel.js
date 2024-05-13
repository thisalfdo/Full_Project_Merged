import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";

export default function Header() {
  const { user } = ChatState();
  const history = useHistory();

  const textColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const hoverTextColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.900");

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  if (!user) {
    // Optionally, render a loading spinner or a default set of components
    return <Box>Loading user data...</Box>;
  }

  return (
    <Box>
      <Flex
        backgroundColor="#EEF7FF"
        color={textColor}
        minHeight="60px"
        paddingTop="2"
        paddingBottom="2"
        paddingLeft="4"
        paddingRight="4"
        borderBottomWidth="1"
        borderStyle="solid"
        borderColor={borderColor}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontFamily="heading"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          paddingLeft={{ base: "4", md: "6", lg: "8" }}
        >
          ArcTec
        </Text>

        <Stack direction="row" spacing={4} alignItems="center">
          {NAV_ITEMS.map((navItem) => (
            <Link
              key={navItem.label}
              padding="2"
              href={navItem.href}
              fontSize="sm"
              fontWeight="500"
              color={linkColor}
              _hover={{
                textDecoration: "none",
                color: hoverTextColor,
              }}
            >
              {navItem.label}
            </Link>
          ))}
        </Stack>

        <Stack paddingRight={{ base: "4", md: "6", lg: "8" }}>
          <Menu>
            <MenuButton
              as={Button}
              backgroundColor="#D6EEFA"
              rightIcon={<ChevronDownIcon />}
              height="48px"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Box>
  );
}

const NAV_ITEMS = [
    {
      label: "Home",
      href: "/dashboard", // Update href for Home to match the default dashboard URL
    },
    {
      label: "Chats",
      href: "/chats",
    },
    {
      label: "Canvas",
      href: "#",
    },
    {
      label: "TaskFlow",
      href: "/taskflow",
    },
    {
      label: "Feedback",
      href: "/feedback",
    },
    {
      label: "Notifications",
      href: "/notification",
    },
    {
      label: "Documents",
      href: "/DocumentList",
    },
  
  ];
