package com.expense_tracker.ui;

import java.util.Scanner;

public class ConsoleIO {
    private final Scanner scanner = new Scanner(System.in);

    public void print(String message) {
        System.out.print(message);
    }

    public void println(String message) {
        System.out.println(message);
    }

    public String readLine() {
        return scanner.nextLine();
    }

    public int readInt() {
        while (!scanner.hasNextInt()) {
            println("Invalid input. Please enter a number:");
            scanner.next();
        }
        int input = scanner.nextInt();
        scanner.nextLine(); // consume newline
        return input;
    }

    public double readDouble() {
        while (!scanner.hasNextDouble()) {
            println("Invalid input. Please enter a valid amount:");
            scanner.next();
        }
        double input = scanner.nextDouble();
        scanner.nextLine(); // consume newline
        return input;
    }
}
