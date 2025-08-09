package com.parking.service

import com.parking.model.Slot
import com.parking.repository.SlotRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class SlotServiceIntegrationTest @Autowired constructor(
    private val slotService: SlotService,
    private val slotRepository: SlotRepository
) {

    @BeforeEach
    fun setup() {
        slotRepository.deleteAll()
        val initial = (1..5).map { Slot(id = it) }
        slotRepository.saveAll(initial)
    }

    @Test
    fun `parkCar should assign first free slot and generate token`() {
        val slots = slotService.getSlots()
        val firstSlot = slots.first { !it.isOccupied }
        val token = slotService.generateToken()

        val parked = slotService.parkCar(firstSlot.id, token)
        assertNotNull(parked)
        assertTrue(parked!!.isOccupied)
        assertEquals(token, parked.token)

        val fromDb = slotRepository.findById(parked.id).orElseThrow()
        assertTrue(fromDb.isOccupied)
        assertEquals(token, fromDb.token)
    }

    @Test
    fun `unparkVehicle should free up a slot given valid token`() {
        // park first
        val firstSlot = slotService.getSlots().first { !it.isOccupied }
        val token = slotService.generateToken()
        slotService.parkCar(firstSlot.id, token)

        // now unpark
        val freed = slotService.unparkVehicle(token)
        assertNotNull(freed)
        assertFalse(freed!!.isOccupied)
        assertNull(freed.token)
    }

    @Test
    fun `parkCar when no slots available returns null`() {
        slotService.getSlots().forEach {
            slotService.parkCar(it.id, slotService.generateToken())
        }
        val none = slotService.parkCar(1, slotService.generateToken())
        assertNull(none)
    }

    @Test
    fun `unparkVehicle with invalid token returns null`() {
        val result = slotService.unparkVehicle("invalid-token")
        assertNull(result)
    }
}
