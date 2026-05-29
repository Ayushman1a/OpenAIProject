package com.example.traveltourism;

import com.example.traveltourism.model.TravelPackage;
import com.example.traveltourism.model.User;
import com.example.traveltourism.repository.TravelPackageRepository;
import com.example.traveltourism.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final TravelPackageRepository travelPackageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TravelPackageRepository travelPackageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.travelPackageRepository = travelPackageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@traveltourism.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles("ADMIN");
            userRepository.save(admin);
        }

        if (travelPackageRepository.count() == 0) {
            travelPackageRepository.save(createPackage(
                    "Coastal Escape: Goa Weekend",
                    "Goa, India",
                    34999.00,
                    4,
                    12,
                    "Relax on golden beaches, enjoy a sunset cruise, and explore vibrant local markets.",
                    "Seafood dinner, tropical beach stay, casino night, water sports.",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"));

            travelPackageRepository.save(createPackage(
                    "Himalayan Adventure",
                    "Manali, India",
                    79999.00,
                    6,
                    10,
                    "Trek mountain trails, soak in hot springs, and admire snow-capped vistas.",
                    "Guided trek, camping, bonfire night, mountain village tour.",
                    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"));

            travelPackageRepository.save(createPackage(
                    "Royal Rajasthan Tour",
                    "Jaipur & Udaipur, India",
                    89999.00,
                    7,
                    8,
                    "Discover palaces, camel safaris, and cultural evenings in the Pink City and City of Lakes.",
                    "Heritage hotel stay, palace dining, folk music, sunset jeep safari.",
                    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80"));

            travelPackageRepository.save(createPackage(
                    "Kerala Backwater Bliss",
                    "Alleppey, India",
                    45999.00,
                    5,
                    10,
                    "Drift along palm-fringed waterways in a luxury houseboat and sample authentic Kerala cuisine.",
                    "Private houseboat cruise, village canal tour, Ayurvedic spa, tea plantation visit.",
                    "https://images.unsplash.com/photo-1541976076758-3877cde7e7ee?auto=format&fit=crop&w=1200&q=80"));
        }
    }

    private TravelPackage createPackage(String title,
                                        String destination,
                                        Double price,
                                        Integer durationDays,
                                        Integer availableSeats,
                                        String description,
                                        String highlights,
                                        String imageUrl) {
        TravelPackage pkg = new TravelPackage();
        pkg.setTitle(title);
        pkg.setDestination(destination);
        pkg.setPrice(price);
        pkg.setDurationDays(durationDays);
        pkg.setAvailableSeats(availableSeats);
        pkg.setDescription(description);
        pkg.setHighlights(highlights);
        pkg.setImageUrl(imageUrl);
        return pkg;
    }
}
