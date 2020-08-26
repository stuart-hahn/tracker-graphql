const Subscription = {
  user: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.user(null, info)
    }
  },
  tournament: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.tournament(null, info)
    }
  },
  match: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.match({
        where: {
          node: {
            tournament: {
              id: args.tournamentId
            }
          }
        }
      }, info)
    }
  },
  player: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.player(null, info)
    }
  }
}

export default Subscription