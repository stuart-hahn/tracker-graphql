import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getUserId from '../utils/getUserId'

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error("Invalid credentials")
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret")
    }
  },
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be at least 8 characters")
    }

    const password = await bcrypt.hash(args.data.password, 10)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret")
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.updateUser({
      data: args.data,
      where: {
        id: userId
      }
    }, info)
  },
  async createTournament(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createTournament({
      data: {
        name: args.data.name,
        creator: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },
  async deleteTournament(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const tournamentExists = await prisma.exists.Tournament({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!tournamentExists) {
      throw new Error("Failed to delete tournament")
    }

    return prisma.mutation.deleteTournament({
      where: {
        id: args.id
      }
    }, info)
  },
  async updateTournament(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const tournamentExists = await prisma.exists.Tournament({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!tournamentExists) {
      throw new Error("Failed to update tournament")
    }

    return prisma.mutation.updateTournament({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)
  },
  async createMatch(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const tournamentExists = await prisma.exists.Tournament({
      id: args.data.tournament,
      creator: {
        id: userId
      }
    })

    if (!tournamentExists) {
      throw new Error("Failed to create match")
    }

    return prisma.mutation.createMatch({
      data: {
        tournament: {
          connect: {
            id: args.data.tournament
          }
        },
        players: {
          connect: [
            {
              id: args.data.homePlayer
            },
            {
              id: args.data.awayPlayer
            }
          ]
        }
      }
    }, info)
  },
  async deleteMatch(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const match = await prisma.query.match({
      where: {
        id: args.id
      }
    }, info)

    if (!match) {
      throw new Error("Match not found")
    }

    const tournamentExists = await prisma.exists.Tournament({
      id: match.tournament.id,
      creator: {
        id: userId
      }
    })

    if (!tournamentExists) {
      throw new Error("Could not delete match")
    }

    return prisma.mutation.deleteMatch({
      where: {
        id: args.id
      }
    }, info)
  },
  async updateMatch(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.updateMatch({
      data: {
        tournament: args.data.tournament,
        homeScore: args.data.homeScore,
        awayScore: args.data.awayScore,
        players: {
          set: [
            {
              id: args.data.homePlayer
            },
            {
              id: args.data.awayPlayer
            }
          ]
        }
      },
      where: {
        id: args.id
      }
    }, info)
  },
  async createPlayer(parent, args, { prisma }, info) {
    return prisma.mutation.createPlayer({ data: args.data }, info)
  },
  async deletePlayer(parent, args, { prisma }, info) {
    return prisma.mutation.deletePlayer({
      where: {
        id: args.id
      }
    }, info)
  },
  async updatePlayer(parent, args, { prisma }, info) {
    return prisma.mutation.updatePlayer({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  }
}

export default Mutation