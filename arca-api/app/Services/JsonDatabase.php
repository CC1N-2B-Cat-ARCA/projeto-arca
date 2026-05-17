<?php

namespace App\Services;

use App\Contracts\DatabaseInterface;

class JsonDatabase implements DatabaseInterface
{
    private string $path;
    public function __construct()
    {
        $this->path = storage_path("app/mockDB.json");
    }

    private function load()
    {
        if (!file_exists($this->path)) {
            return [];
        }

        return json_decode(file_get_contents($this->path), true) ?? [];
    }

    private function save(mixed $data)
    {
        file_put_contents($this->path, json_encode($data, JSON_PRETTY_PRINT));

        #logger()->info('DB SAVED', $data);
    }
    public function all(string $table)
    {
        $db = $this->load();
        return $db[$table] ?? [];
    }

    public function find(string $table, int $id)
    {
        $items = $this->all($table);
        return collect($items)->firstWhere('id', $id);
    }

    public function findBy(string $table, string $field, mixed $data)
    {
        $items = $this->all($table);

        foreach ($items as $item) {
            if (isset($item[$field]) && $item[$field] === $data) {
                return $item;
            }
        }

        return null;
    }

    private function getnextId(array $items)
    {
        if (empty($items)) return 1;

        $max = max(array_column($items, 'id'));
        return $max + 1;
    }
    private function exists(array $items, string $field, mixed $value)
    {
        foreach ($items as $item) {
            if (
                isset($item[$field]) &&
                $item[$field] === $value
            ) return true;
        }
        return false;
    }
    public function insert(string $table, array $data)
    {
        $db = $this->load();

        if (!isset($db[$table])) {
            $db[$table] = [];
        }

        if ($this->exists($db[$table], 'email', $data['email'])) {
           return false; 
        }
        if ($this->exists($db[$table], 'name', $data['name'])) {
            return false;
        }

        $nextId = $this->getnextId($db[$table]);

        $data['id'] = $nextId;

        $db[$table][] = $data;
        $this->save($db);
        return $data;
    }
    public function update(string $table, int $id, array $data)
    {
        $db = $this->load();

        foreach ($db[$table] as &$item) {
            if ($item['id'] == $id) {
                $item = array_merge($item, $data);
            }
        }
        $this->save($db);
        return true;
    }
    public function delete(string $table, int $id)
    {
        $db = $this->load();

        $db[$table] = array_filter($db[$table], fn($item) => $item['id'] != $id);

        $this->save($db);

        return true;
    }

    public function purge()
    {
        /* WARNING:
        | Essa função apaga TODA a database sem choro.
        | Então use com cuidado, porra! 
        */
        $this->save([
            'users' => []
        ]);
    }
}
