<h2>New Contact Form Submission</h2>

<p><strong>First name:</strong> {{ $data['firstName'] }}</p>
<p><strong>Last name:</strong> {{ $data['lastName'] }}</p>
<p><strong>Email:</strong> {{ $data['email'] }}</p>
<p><strong>Country:</strong> {{ $data['country'] ?? 'N/A' }}</p>
<p><strong>Phone:</strong> {{ $data['phone'] ?? 'N/A' }}</p>
<p><strong>Message:</strong></p>
<p>{{ $data['message'] }}</p>
