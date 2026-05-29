package com.example.traveltourism.service;

import com.example.traveltourism.model.Booking;
import com.example.traveltourism.model.TravelPackage;
import com.example.traveltourism.model.User;
import com.example.traveltourism.payload.request.BookingRequest;
import com.example.traveltourism.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repository;
    private final UserService userService;
    private final TravelPackageService packageService;

    public BookingService(BookingRepository repository, UserService userService, TravelPackageService packageService) {
        this.repository = repository;
        this.userService = userService;
        this.packageService = packageService;
    }

    public Booking bookPackage(String username, BookingRequest request) {
        User user = userService.findByUsername(username);
        TravelPackage travelPackage = packageService.findById(request.getPackageId());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTravelPackage(travelPackage);
        booking.setStatus("CONFIRMED");
        booking.setBookedOn(LocalDate.now());
        booking.setTravelDate(request.getTravelDate());
        booking.setTravelerCount(request.getTravelerCount());
        booking.setContactPhone(request.getContactPhone());
        booking.setTotalPrice(travelPackage.getPrice() * request.getTravelerCount());

        return repository.save(booking);
    }

    public Booking cancelBooking(String username, Long bookingId) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("You are not authorized to cancel this booking.");
        }

        booking.setStatus("CANCELLED");
        return repository.save(booking);
    }

    public List<Booking> findBookingsByUser(String username) {
        return repository.findByUserUsername(username);
    }
}
