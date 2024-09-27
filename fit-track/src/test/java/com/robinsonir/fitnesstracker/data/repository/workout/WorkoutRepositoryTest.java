package com.robinsonir.fitnesstracker.data.repository.workout;

import com.robinsonir.fitnesstracker.data.Gender;
import com.robinsonir.fitnesstracker.data.entity.customer.CustomerEntity;
import com.robinsonir.fitnesstracker.data.entity.workout.WorkoutEntity;
import com.robinsonir.fitnesstracker.data.repository.customer.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
@Rollback
public class WorkoutRepositoryTest {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void testSaveWorkout() {
        // Create and save a customer
        CustomerEntity customer = new CustomerEntity("John Doe", "john.doe@example.com", "password123", 30, Gender.MALE);
        customerRepository.save(customer);

        // Create a workout entity
        WorkoutEntity workout = new WorkoutEntity();
        workout.setCustomer(customer);
        workout.setWorkoutType("Running");
        workout.setCalories(500);
        workout.setDurationMinutes(60);
        workout.setWorkoutDate(OffsetDateTime.now());

        // Save the workout
        WorkoutEntity savedWorkout = workoutRepository.save(workout);

        // Validate workout is saved and has an ID
        assertThat(savedWorkout.getId()).isNotNull();
        assertThat(savedWorkout.getWorkoutType()).isEqualTo("Running");
        assertThat(savedWorkout.getCalories()).isEqualTo(500);
        assertThat(savedWorkout.getDurationMinutes()).isEqualTo(60);
    }

    @Test
    void testFindWorkoutById() {
        // Create and save a customer
        CustomerEntity customer = new CustomerEntity("Jane Doe", "jane.doe@example.com", "securePass", 28, Gender.FEMALE);
        customerRepository.save(customer);

        // Create and save a workout
        WorkoutEntity workout = new WorkoutEntity();
        workout.setCustomer(customer);
        workout.setWorkoutType("Cycling");
        workout.setCalories(300);
        workout.setDurationMinutes(45);
        workout.setWorkoutDate(OffsetDateTime.now());
        workoutRepository.save(workout);

        // Fetch the workout by ID
        Optional<WorkoutEntity> foundWorkout = workoutRepository.findWorkoutById(workout.getId());

        // Assert the workout was found and data is correct
        assertTrue(foundWorkout.isPresent());
        assertThat(foundWorkout.get().getWorkoutType()).isEqualTo("Cycling");
    }

    @Test
    void testFindAllWorkouts() {
        // Create and save customers
        CustomerEntity customer1 = new CustomerEntity("Bob Smith", "bob.smith@example.com", "bobPass", 35, Gender.MALE);
        customerRepository.save(customer1);

        CustomerEntity customer2 = new CustomerEntity("Alice Johnson", "alice.johnson@example.com", "alicePass", 29, Gender.FEMALE);
        customerRepository.save(customer2);

        // Create and save workouts
        WorkoutEntity workout1 = new WorkoutEntity();
        workout1.setCustomer(customer1);
        workout1.setWorkoutType("Swimming");
        workout1.setCalories(400);
        workout1.setDurationMinutes(50);
        workout1.setWorkoutDate(OffsetDateTime.now());
        workoutRepository.save(workout1);

        WorkoutEntity workout2 = new WorkoutEntity();
        workout2.setCustomer(customer2);
        workout2.setWorkoutType("Yoga");
        workout2.setCalories(200);
        workout2.setDurationMinutes(30);
        workout2.setWorkoutDate(OffsetDateTime.now());
        workoutRepository.save(workout2);

        // Fetch all workouts
        List<WorkoutEntity> workouts = workoutRepository.findAllWorkouts();

        // Assert that the workouts were fetched
        assertThat(workouts).isNotNull();
        assertThat(workouts.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    void testExistsWorkoutEntityByCustomer() {
        // Create and save a customer
        CustomerEntity customer = new CustomerEntity("Chris Evans", "chris.evans@example.com", "captain123", 40, Gender.MALE);
        customerRepository.save(customer);

        // Create and save a workout
        WorkoutEntity workout = new WorkoutEntity();
        workout.setCustomer(customer);
        workout.setWorkoutType("Weightlifting");
        workout.setCalories(600);
        workout.setDurationMinutes(75);
        workout.setWorkoutDate(OffsetDateTime.now());
        workoutRepository.save(workout);

        // Test if a workout exists for the customer
        boolean exists = workoutRepository.existsWorkoutEntityByCustomer(customer);
        assertTrue(exists);

        // Test for a non-existent customer (without any workouts)
        CustomerEntity newCustomer = new CustomerEntity("Mark Ruffalo", "mark.ruffalo@example.com", "hulk123", 53, Gender.MALE);
        customerRepository.save(newCustomer);

        boolean notExists = workoutRepository.existsWorkoutEntityByCustomer(newCustomer);
        assertFalse(notExists);
    }
}