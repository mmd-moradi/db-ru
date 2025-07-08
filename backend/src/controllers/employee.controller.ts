import { Request, Response } from 'express';
import * as employeeService from '../services/employee.service';

export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const { restauranteId } = req.query;
        const employees = await employeeService.findAll(restauranteId ? Number(restauranteId) : undefined);
        res.status(200).json(employees);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const employee = await employeeService.findById(id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const newEmployee = await employeeService.create(req.body);
        res.status(201).json(newEmployee);
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation on CPF
            res.status(409).json({ message: 'Employee with this CPF already exists.', details: error.detail });
            return;
        }
        if (error.code === '23503') { // Foreign key violation
          res.status(400).json({ message: 'Invalid restaurante_id.', details: error.detail });
          return;
        }
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedEmployee = await employeeService.update(id, req.body);
        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await employeeService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};