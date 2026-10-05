package com.quickbites.service;

import com.quickbites.entity.Delivery;
import com.quickbites.entity.Order;
import com.quickbites.repository.DeliveryRepository;
import com.quickbites.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;


    public DeliveryService(
            DeliveryRepository deliveryRepository,
            OrderRepository orderRepository
    ) {

        this.deliveryRepository =
                deliveryRepository;

        this.orderRepository =
                orderRepository;
    }


    public List<Delivery> getAllDeliveries() {

        return deliveryRepository.findAll();

    }


    public Delivery getDeliveryById(
            Integer id
    ) {

        return deliveryRepository.findById(id)

                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Delivery not found"
                                )
                );

    }


    // ==================================================
    // CREATE / ASSIGN DELIVERY
    // ==================================================

    public Delivery createDelivery(
            Delivery delivery
    ) {

        Delivery existing =
                deliveryRepository.findExistingDelivery(
                        delivery.getOrder_id()
                );


        // ----------------------------------------------
        // Existing delivery
        // ----------------------------------------------

        if (existing != null) {

            existing.setRider_id(
                    delivery.getRider_id()
            );


            existing.setDelivery_status(
                    Delivery.DeliveryStatus.ASSIGNED
            );


            existing.setAssigned_at(
                    LocalDateTime.now()
            );


            existing.setDelivered_at(
                    null
            );


            return deliveryRepository.save(
                    existing
            );
        }


        // ----------------------------------------------
        // New delivery
        // ----------------------------------------------

        delivery.setDelivery_status(
                Delivery.DeliveryStatus.ASSIGNED
        );


        delivery.setAssigned_at(
                LocalDateTime.now()
        );


        delivery.setDelivered_at(
                null
        );


        return deliveryRepository.save(
                delivery
        );
    }


    // ==================================================
    // UPDATE DELIVERY
    // ==================================================

    public Delivery updateDelivery(
            Integer id,
            Delivery deliveryDetails
    ) {

        Delivery delivery =
                getDeliveryById(id);


        Delivery.DeliveryStatus newStatus =
                deliveryDetails.getDelivery_status();


        if (newStatus == null) {

            throw new RuntimeException(
                    "Delivery status is required"
            );

        }


        delivery.setOrder_id(
                deliveryDetails.getOrder_id()
        );


        delivery.setRider_id(
                deliveryDetails.getRider_id()
        );


        delivery.setDelivery_status(
                newStatus
        );


        // ----------------------------------------------
        // Keep assignment time
        // ----------------------------------------------

        if (
                deliveryDetails.getAssigned_at()
                != null
        ) {

            delivery.setAssigned_at(
                    deliveryDetails.getAssigned_at()
            );

        }


        // ----------------------------------------------
        // Delivered time
        // ----------------------------------------------

        if (
                newStatus ==
                Delivery.DeliveryStatus.DELIVERED
        ) {

            if (
                    deliveryDetails.getDelivered_at()
                    != null
            ) {

                delivery.setDelivered_at(
                        deliveryDetails.getDelivered_at()
                );

            } else if (
                    delivery.getDelivered_at()
                    == null
            ) {

                delivery.setDelivered_at(
                        LocalDateTime.now()
                );

            }

        } else {

            delivery.setDelivered_at(
                    null
            );

        }


        // ----------------------------------------------
        // Save delivery
        // ----------------------------------------------

        Delivery savedDelivery =
                deliveryRepository.save(
                        delivery
                );


        // ----------------------------------------------
        // Synchronize order status
        // ----------------------------------------------

        syncOrderStatus(
                savedDelivery.getOrder_id(),
                newStatus
        );


        return savedDelivery;
    }


    // ==================================================
    // SYNCHRONIZE ORDER STATUS
    // ==================================================

    private void syncOrderStatus(
            Integer orderId,
            Delivery.DeliveryStatus deliveryStatus
    ) {

        if (orderId == null) {

            return;

        }


        Order order =
                orderRepository.findById(
                        orderId
                )

                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Order not found"
                                )
                );


        // ----------------------------------------------
        // Rider starts delivery
        // ----------------------------------------------

        if (
                deliveryStatus ==
                Delivery.DeliveryStatus.OUT_FOR_DELIVERY
        ) {

            order.setOrder_status(
                    Order.OrderStatus.OUT_FOR_DELIVERY
            );


            orderRepository.save(
                    order
            );

        }


        // ----------------------------------------------
        // Rider completes delivery
        // ----------------------------------------------

        else if (
                deliveryStatus ==
                Delivery.DeliveryStatus.DELIVERED
        ) {

            order.setOrder_status(
                    Order.OrderStatus.DELIVERED
            );


            orderRepository.save(
                    order
            );

        }

    }


    // ==================================================
    // DELETE DELIVERY
    // ==================================================

    public void deleteDelivery(
            Integer id
    ) {

        deliveryRepository.deleteById(
                id
        );

    }

}