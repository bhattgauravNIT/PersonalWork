import { Component, signal, viewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Baby');
  
  images = ['imgA.jpeg','imgB.jpeg','imgC.jpeg','imgD.jpeg','imgE.jpeg','imgF.jpeg','imgG.jpeg', 'imgH.jpeg','imgI.jpeg','imgJ.jpeg','imgK.jpeg','imgL.jpeg'
  ];
  
  currentImageIndex = signal(0);
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  showCelebration = signal(false);
  showMessageForm = signal(false);
  showEmojiPicker = signal(false);
  messageSent = signal(false);
  userMessage = signal('');
  audioPlayer = viewChild<ElementRef<HTMLAudioElement>>('audioPlayer');
  
  get currentImage() {
    return this.images[this.currentImageIndex()];
  }
  
  nextImage() {
    if (this.currentImageIndex() < this.images.length - 1) {
      this.currentImageIndex.set(this.currentImageIndex() + 1);
    } else {
      this.currentImageIndex.set(0);
    }
  }
  
  prevImage() {
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.set(this.currentImageIndex() - 1);
    } else {
      this.currentImageIndex.set(this.images.length - 1);
    }
  }
  
  toggleMusic() {
    const audio = this.audioPlayer()?.nativeElement;
    if (audio) {
      if (this.isPlaying()) {
        audio.pause();
        this.isPlaying.set(false);
      } else {
        audio.play().then(() => {
          this.isPlaying.set(true);
        }).catch((error) => {
          console.log('Play prevented:', error);
          this.isPlaying.set(false);
        });
      }
    }
  }
  
  onTimeUpdate(event: Event) {
    const audio = event.target as HTMLAudioElement;
    this.currentTime.set(audio.currentTime);
  }
  
  onLoadedMetadata(event: Event) {
    const audio = event.target as HTMLAudioElement;
    this.duration.set(audio.duration);
  }
  
  onProgressClick(event: MouseEvent) {
    const audio = this.audioPlayer()?.nativeElement;
    if (audio) {
      const progressBar = event.currentTarget as HTMLElement;
      const clickX = event.offsetX;
      const width = progressBar.offsetWidth;
      const percentage = clickX / width;
      audio.currentTime = percentage * audio.duration;
    }
  }
  
  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  get progress(): number {
    if (this.duration() === 0) return 0;
    return (this.currentTime() / this.duration()) * 100;
  }
  
  moveNoButton(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const maxX = window.innerWidth - button.offsetWidth - 100;
    const maxY = window.innerHeight - button.offsetHeight - 100;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    button.style.position = 'fixed';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
  }
  
  onYesClick() {
    this.showCelebration.set(true);
    setTimeout(() => {
      this.showCelebration.set(false);
      this.showMessageForm.set(true);
    }, 4000);
  }
  
  playClickSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  
  onMessageSubmit(message: string) {
    if (!message.trim()) {
      return;
    }
    
    // Play click sound
    this.playClickSound();
    
    this.userMessage.set(message);
    
    // Check if EmailJS is loaded
    if (typeof (window as any).emailjs === 'undefined') {
      console.error('EmailJS is not loaded');
      alert('Email service not available. Please refresh the page.');
      return;
    }
    
    const timestamp = new Date().toLocaleString();
    
    // Send email using EmailJS
    (window as any).emailjs.send(
      'service_pehl2lh',  // Replace with your EmailJS service ID
      'template_trc3bb9', // Replace with your EmailJS template ID
      {
        message: message.trim(),
        timestamp: timestamp,
        from_name: 'Your Valentine'
      }
    ).then(
      (response: any) => {
        console.log('Message sent successfully!', response.status, response.text);
        this.messageSent.set(true);
      },
      (error: any) => {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again!');
      }
    );
  }
  
  onNoClick(event: Event) {
    event.preventDefault();
    this.moveNoButton(event as MouseEvent);
  }
  
  closeMessageForm() {
    this.showMessageForm.set(false);
    this.showEmojiPicker.set(false);
    this.messageSent.set(false);
  }
  
  toggleEmojiPicker() {
    this.showEmojiPicker.set(!this.showEmojiPicker());
  }
  
  insertEmoji(emoji: string, textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + emoji + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    this.showEmojiPicker.set(false);
  }
}
