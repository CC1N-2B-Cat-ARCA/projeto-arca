<?php 

namespace App\Contracts;

interface DatabaseInterface {
    public function all(string $table);
    public function find(string $table, int $id);
    public function findBy(string $table, string $field, mixed $value);
    public function insert(string $table, array $data);
    public function update(string $table, int $id, array $data);
    public function delete(string $table, int $id);
    public function purge();
}