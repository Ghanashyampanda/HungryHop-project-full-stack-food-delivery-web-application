import User from "./models/user.model.js"
import Order from "./models/order.model.js"

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.id)
    
    socket.on('identity', async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          socketId: socket.id, isOnline: true
        }, { new: true })
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('joinOrder', ({ orderId }) => {
      socket.join(orderId)
      console.log(`Socket ${socket.id} joined order room: ${orderId}`)
    })

    socket.on('leaveOrder', ({ orderId }) => {
      socket.leave(orderId)
      console.log(`Socket ${socket.id} left order room: ${orderId}`)
    })

    socket.on('updateLocation', async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          isOnline: true,
          socketId: socket.id
        })

        if (user) {
          // Find active orders assigned to this delivery boy that are not fully delivered
          const activeOrders = await Order.find({
            "shopOrders.assignedDeliveryBoy": userId,
            "shopOrders.status": { $ne: "delivered" }
          })

          activeOrders.forEach(order => {
            io.to(order._id.toString()).emit('updateDeliveryLocation', {
              deliveryBoyId: userId,
              latitude,
              longitude
            })
          })
        }
      } catch (error) {
          console.log('updateDeliveryLocation error', error)
      }
    })

    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          isOnline: false
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
}