const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createContext = () => {
  return { prisma };
};

module.exports = { createContext };