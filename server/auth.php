<?php
if (file_exists(__DIR__.'/config.php'))
    include(__DIR__.'/config.php');

class User {

    public function __construct()
    {
        $this->validation = Array();

    }

    protected function hashPass($pass) {
        return md5($pass."testtask");
    }

    protected function emailValid($email) {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            array_push($this->validation, 'email');
        }
    }

    protected function fioValid($fio) {
        if (preg_match('/[^а-я ]+/msiu', $fio)) {
            array_push($this->validation, 'fio');
        }
    }

    protected function passValid($pass, $passConfirm) {
        if (!preg_match('/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/', $pass)) {
            array_push($this->validation, 'pass');
        } else {
            if ($pass === $passConfirm) {
                return $this->hashPass($pass);
            } else {
                array_push($this->validation, 'passConfirm');

            }
        }
    }

    protected function phoneValid($phone) {
        if (!preg_match('/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/', $phone)) {
            array_push($this->validation, 'phone');
        }
    }

    public function createUser($config, $fio, $phone, $email, $pass, $passConfirm) {
        $this->phoneValid($phone);
        $this->emailValid($email);
        $pass = $this->passValid($pass, $passConfirm);
        $this->fioValid($fio);

        if ($this->validation) {
            $res = json_encode(Array('validError' => $this->validation), 1);

            echo $res;
            die();
        } else {

            $mysqli = new mysqli($config->host, $config->user, $config->password, $config->db);
            if ($mysqli->connect_error) {
                $result = Array('error' => 'error with connection db');

                $res = json_encode($result, 1);

                echo $res;
                die();
            } else {

                $query = "INSERT INTO `Task` (`Fio`, `tel`, `email`, `pass`) VALUES ('{$fio}', '{$phone}', '{$email}', '{$pass}')";

                if ($mysqli->query($query)) {
                    $result = Array('access' => true);
                    $res = json_encode($result, 1);

                    echo $res;
                } else {
                    $result = Array('error' => $mysqli->error);
                    $res = json_encode($result, 1);

                    echo $res;
                }
                $mysqli->close();

            }
        }
    }

    public function authUser($config, $email, $pass) {


        $mysqli = new mysqli($config->host, $config->user, $config->password, $config->db);
        if ($mysqli->connect_error) {
            $result = Array('error' => 'error with connection db');

            $res = json_encode($result, 1);

            echo $res;
            die();
        } else {
            $pass = $this->hashPass($pass);
            $query = "SELECT * FROM `Task` WHERE `email` = '{$email}' AND `pass` = '{$pass}'";

            if ($result = $mysqli->query($query)) {
                $row = $result->fetch_row();
                if (count($row) !== 0) {

                    $res = Array('access' => $row);

                    echo json_encode($res, 1);
                } else {
                    echo json_encode(Array('access_denied' => 'wrong data'));
                }


            } else {
                $result = Array('error' => $mysqli->error);
                $res = json_encode($result, 1);

                echo $res;
            }
            $mysqli->close();
        }
    }

}

$_config = new Config();

if ($_POST) {
    $fio = $_POST['fio'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $pass = $_POST['pass'];
    $passConfirm = $_POST['passConfirm'];


    $user = new User();

    $user->createUser($_config, $fio, $phone, $email, $pass, $passConfirm);
} else if ($_GET) {
    $email = $_GET['email'];
    $pass = $_GET['pass'];

    $user = new User();

    $user->authUser($_config, $email, $pass);

}