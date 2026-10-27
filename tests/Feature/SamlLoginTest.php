<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Mockery;
use OneLogin\Saml2\Auth as SamlAuth;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->samlAuth = Mockery::mock(SamlAuth::class);
    $this->app->instance(SamlAuth::class, $this->samlAuth);
});

afterEach(function () {
    Mockery::close();
});

test('saml login redirect invokes saml auth login', function () {
    $this->samlAuth->shouldReceive('login')->once()->andReturnNull();

    $response = $this->get('/saml/login');

    // Mocked login() does not exit, so controller returns empty 200 response.
    $response->assertStatus(200);
});

test('saml acs provisions user and logs in on valid assertion', function () {
    $this->samlAuth->shouldReceive('processResponse')->once()->andReturnNull();
    $this->samlAuth->shouldReceive('getErrors')->once()->andReturn([]);
    $this->samlAuth->shouldReceive('isAuthenticated')->once()->andReturn(true);
    $this->samlAuth->shouldReceive('getAttributes')->once()->andReturn([
        'email' => ['ridho.fatahillah@tataoptima.com'],
        'name' => ['Muhammad Ridha Fatahillah'],
        'department' => ['IT'],
        'position' => ['Staff Programmer'],
    ]);
    $this->samlAuth->shouldReceive('getNameId')->once()->andReturn('ridho.fatahillah@tataoptima.com');

    $response = $this->post('/saml/acs', ['SAMLResponse' => 'fake-response']);

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('success', 'Login berhasil melalui SAML.');

    $user = User::where('email', 'ridho.fatahillah@tataoptima.com')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Muhammad Ridha Fatahillah');
    expect($user->department)->toBe('IT');
    expect($user->position)->toBe('Staff Programmer');
    expect(Auth::check())->toBeTrue();
});

test('saml acs redirects to error when no email attribute', function () {
    $this->samlAuth->shouldReceive('processResponse')->once()->andReturnNull();
    $this->samlAuth->shouldReceive('getErrors')->once()->andReturn([]);
    $this->samlAuth->shouldReceive('isAuthenticated')->once()->andReturn(true);
    $this->samlAuth->shouldReceive('getAttributes')->once()->andReturn([]);
    $this->samlAuth->shouldReceive('getNameId')->once()->andReturn(null);

    $response = $this->post('/saml/acs', ['SAMLResponse' => 'fake-response']);

    $response->assertRedirect('/auth/error');
});

test('saml acs redirects to error when saml response has errors', function () {
    $this->samlAuth->shouldReceive('processResponse')->once()->andReturnNull();
    $this->samlAuth->shouldReceive('getErrors')->once()->andReturn(['Invalid signature']);

    $response = $this->post('/saml/acs', ['SAMLResponse' => 'fake-response']);

    $response->assertRedirect('/auth/error');
});

test('saml acs redirects to error when not authenticated', function () {
    $this->samlAuth->shouldReceive('processResponse')->once()->andReturnNull();
    $this->samlAuth->shouldReceive('getErrors')->once()->andReturn([]);
    $this->samlAuth->shouldReceive('isAuthenticated')->once()->andReturn(false);

    $response = $this->post('/saml/acs', ['SAMLResponse' => 'fake-response']);

    $response->assertRedirect('/auth/error');
});

test('saml metadata returns xml content type', function () {
    $response = $this->get('/saml/metadata');

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'application/samlmetadata+xml');
});
