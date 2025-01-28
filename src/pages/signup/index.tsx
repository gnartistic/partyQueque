import React, { useState, ChangeEvent, FormEvent } from "react";
import { api } from "@/utils/api";
import { Box, Input, Button, Text, VStack, Checkbox, useToast } from "@chakra-ui/react";

interface SignupFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
  spotifyauth: boolean;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    password: "",
    spotifyauth: false,
  });

  const toast = useToast();

  const mutation = api.users.createUser.useMutation({
    onSuccess: (data: any) => {
      toast({
        title: "Welcome to Vibeify.ai!",
        description: `User ${data.firstname} created successfully!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, spotifyauth: e.target.checked });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("running mutation");
    mutation.mutate(formData);
  };

  console.log("on signup page")

  return (
    <VStack spacing={4} mt={8} p={4} alignItems="center">
      <Text fontSize="2xl" fontWeight="bold">Signup Page</Text>
      <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth="400px">
        <VStack spacing={4}>
          <Input
            placeholder="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Birthday (YYYY-MM-DD)"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Box>
            <Checkbox
              name="spotifyauth"
              isChecked={formData.spotifyauth}
              onChange={handleCheckboxChange}
            >
              Spotify Authenticated
            </Checkbox>
          </Box>
          <Button
            type="submit"
            isLoading={mutation.isLoading}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
      {mutation.isError && (
        <Text color="red.500">Error: {mutation.error.message}</Text>
      )}
    </VStack>
  );
};

export default Signup;