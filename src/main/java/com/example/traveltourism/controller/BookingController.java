package com.example.traveltourism.controller;

import com.example.traveltourism.model.Booking;
import com.example.traveltourism.payload.request.BookingRequest;
import com.example.traveltourism.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(Principal principal) {
        return bookingService.findBookingsByUser(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking bookPackage(@Valid @RequestBody BookingRequest request, Principal principal) {
        return bookingService.bookPackage(principal.getName(), request);
    }

    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id, Principal principal) {
        return bookingService.cancelBooking(principal.getName(), id);
    }
}
